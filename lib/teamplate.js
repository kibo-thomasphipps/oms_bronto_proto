class TemplateParser {
  constructor({ body, container }) {
    this.body = body;
    this.outterContainer = this.container = container || new Template();
  }
  parse() {
    let last = 0;
    let m = null;
    let regex =
      /%%\#(?<key>.*?)%%|(?<dynamic_code_start>{dynamic_code})|(?<dynamic_code_end>{\/dynamic_code})|(?<loop_start>{loop})|(?<loop_end>{\/loop})|(?<else>{else.*?})|{else(?<elseif>.*?)}|{if\w*(?<if_start>.*?)}|(?<if_end>{\/if})/gms;
    while ((m = regex.exec(this.body)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      this.container.nodes.push(
        new LiteralNode({ value: this.body.substring(last, m.index) })
      );
      last = m.index + m[0].length;
      if (m.groups.key) {
        this.container.nodes.push(new VariableNode({ key: m.groups.key }));
      } else if (m.groups.dynamic_code_start) {
        let dc = new DynamicCode({
          parent: this.container,
          body: this.body,
          index: m.index,
        });
        this.container.nodes.push(dc);
        this.container = dc;
      } else if (m.groups.loop_start) {
        let loop = new Loop({
          parent: this.container,
          body: this.body,
          index: m.index,
        });
        this.container.nodes.push(loop);
        this.container = loop;
      } else if (
        m.groups.loop_end ||
        m.groups.dynamic_code_end ||
        m.groups.dynamic_code_end ||
        m.groups.if_end
      ) {
        this.container = this.container.parent;
      } else if (m.groups.if_start) {
        let ifNode = new IfNode({
          parent: this.container,
          body: this.body,
          index: m.index,
          condition: m.groups.if_start,
        });
        this.container.nodes.push(ifNode);
        this.container = ifNode;
      } else if (m.groups.else) {
        let elseNode = new ContanerNode({
          parent: this.container.parent,
          body: this.body,
          index: m.index,
        });
        this.container.addElse(elseNode);
        this.container = elseNode;
      } else if (m.groups.elseif) {
        let elseIfNode = new IfNode({
          parent: this.container.parent,
          body: this.body,
          index: m.index,
          condition: m.groups.if_start,
        });
        this.container.addBranch(elseIfNode);
        this.container = elseIfNode;
      }
    }
    this.container.nodes.push(
      new LiteralNode({ value: this.body.substring(last, this.body.length) })
    );
    return this.outterContainer;
  }
}

class ContanerNode {
  constructor(args) {
    this.parent = args?.parent;
    this.nodes = [];
  }
  render(context) {
    let ret = "";
    for (let node of this.nodes) {
      ret += node.render(context);
    }
    return ret;
  }
}
class Template extends ContanerNode {}
class DynamicCode extends ContanerNode {}
class Loop extends ContanerNode {
  render(context) {
    let ret = "";
    for (let i = 1; i <= context.maxIter; i++) {
      let subContext = context.iterate(i);
      ret += super.render(subContext);
    }
    return ret;
  }
}
class LiteralNode {
  constructor({ value }) {
    this.value = value;
  }
  render(context) {
    return this.value;
  }
}
class IfNode extends ContanerNode {
  constructor({ condition, ...args }) {
    super(args);
    this.branches = [];
    this.elseContainer = null;
    this.statement = new Statement(condition.trim());
  }
  addBranch(branch) {
    this.branches.push(branch);
  }
  addElse(elseContainer) {
    this.elseContainer = elseContainer;
  }
  render(context) {
    if (this.statement.render(context)) {
      return super.render(context);
    }
    for (let branch of this.branches) {
      if (branch.statement.isTrue(context)) {
        return branch.render(context);
      }
    }
    if (this.elseContainer) {
      return this.elseContainer.render(context);
    }
    return '';
  }
}
class Statement {
  constructor(body) {
    this.nodes = [];
    this.parse(body.toLowerCase().trim());
  }
  parse(body) {
    let allGroup = body.split(/\sand\s/gs);
    if (allGroup.length > 1) {
      this.op = "and";
      this.nodes = allGroup.map((_) => new Statement(_));
      return;
    }
    let anyGroup = body.split(/\sor\s/gs);
    if (anyGroup.length > 1) {
      this.op = "or";
      this.nodes = anyGroup.map((_) => new Statement(_));
      return;
    }
    this.op = "exists";
    let regex =
      /"%%\#(?<key>.*?)\%%"|(?<op>eq|neq|lt|gt|OR|AND)|"(?<literal>\w*.*\w+?)"/gs;
    let m = null;
    while ((m = regex.exec(body)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      if (m.groups.op) {
        this.op = m.groups.op;
      } else if (m.groups.key) {
        this.nodes.push(new VariableNode({ key: m.groups.key }));
      } else if (m.groups.literal) {
        this.nodes.push(new LiteralNode({ value: m.groups.literal }));
      }
    }
  }
  render(context) {
    const left = this.nodes[0].render(context);
    const right = this.nodes[1]?.render(context);
    switch( this.op){
        case 'eq':
            return left?.toLowerCase() == right?.toLowerCase();
        case 'lt':
            return parseFloat(left) < parseFloat(right);
        case 'gt':
            return parseFloat(left) > parseFloat(right);
        case 'or':
            return this.nodes.some((_) => _.render(context));
        case 'and':
            return this.nodes.every((_) => _.render(context));
        default:
            return left?.toLowerCase() != right?.toLowerCase();
    }   
    
  }
}
class VariableNode  {
  constructor({ key }) { 
    this.key = key;
  }
  render(context) {
    return context.getValue(this.key);
  }
}
class RenderContext {
  constructor({ values, iteration }) {
    this.values = values;
    this.iteration = iteration || 0;
    this.output = "";
    this.maxIter = 0;
    Object.keys(this.values).forEach((_) => {
      const i = parseInt(/^.*?_(?<num>\d+)$/.exec(_)?.groups.num);
      if (!isNaN(i)) {
        this.maxIter = Math.max(this.maxIter, i);
      }
    });
  }
  iterate(count) {
    return new RenderContext({
      values: this.values,
      iteration: count,
      output: this.output,
    });
  }
  getValue(key) {
    let ret = null;
    if (key.endsWith("_#")) {
      ret = this.values[key.substr(0, key.length - 1) + this.iteration];
    } else {
      ret = this.values[key];
    }
    return ret == undefined ? "" : ret;
  }
}

exports.Template = Template;
exports.RenderContext = RenderContext;
exports.TemplateParser = TemplateParser;
