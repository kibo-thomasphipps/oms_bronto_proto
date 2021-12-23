https://help.bronto.com/bmp/help-source/concept/c_bmp_tags_scheduled_vs_send.html






facet=categoryCode,Tenant~color,Tenant~brand,price&facetHierValue=categoryCode:_root&facetHierDepth=categoryCode:2&facetFieldRangeQuery=price:[10 to 100]




facet=categoryCode&facetHierValue=categoryCode:_root&facetHierDepth=categoryCode:2&facetFieldRangeQuery=saleprice:[10 to 100],[100 to 200]


https://services-tp.dev10.kubedev.kibo-dev.com/mozu.productruntime.webapi/commerce/catalog/storefront/productsearch/search/?facet=categoryCode,&facetHierValue=categoryCode:_root&facetHierDepth=categoryCode:2&facetFieldRangeQuery=price:[10 to 100]



facet=categoryCode,Tenant~color,Tenant~brand,price&facetHierValue=categoryCode:_root&facetHierDepth=categoryCode:2&facetFieldRangeQuery=price:[0 TO 10],price:[10 TO 50],price:[50 TO 100],price:[100 TO 500],price:[500 TO *]


facet=categoryCode,Tenant~color,Tenant~brand,price
facetHierValue=categoryCode:_root
facetHierDepth=categoryCode:2
facetFieldRangeQuery=price:[0 TO 10],price:[10 TO 50],price:[50 TO 100],price:[100 TO 500],price:[500 TO *]



facetTemplate=categoryCode:40&facet=categoryCode


http://localhost:2188/commerce/catalog/storefront/productsearch/search/?facetTemplate=categoryCode:_root&facet=categoryCode&facetHierValue=CategoryCode:_root







facetTemplate=categoryCode:_root&facet=categoryId&facetHierValue=CategoryCode:_root




http://localhost:2188/commerce/catalog/storefront/productsearch/search/?

query=term
facetTemplate=categoryCode:_root
facet=categoryId
facetHierValue=CategoryCode:_root
facetValueFilter=categoryId:1,Tenant~color:green

https://services-tp.dev10.kubedev.kibo-dev.com/mozu.productruntime.webapi/commerce/catalog/storefront/productsearch/search/?facetTemplate=categoryCode:_root&facet=categoryId&fsacetHierValue=CategoryCode:_root&facetValueFilter=categoryId:1,Tenant~color:green




 facetTemplate:"categoryCode:_root",
    facet:"categoryId",
    fsacetHierValue:"CategoryCode:_root",
    facetValueFilter:"categoryId:1,Tenant~color:green"



# Write your query or mutation here
query{
  productSearch(query:"",
  facetTemplate:"categoryCode:_root",
    facet:"categoryId",
    fsacetHierValue:"CategoryCode:_root",
    facetValueFilter:"categoryId:1,Tenant~color:green"
  ){
    facets{
      label,
      facetType,
      values{
        label,
        count,
        value,
        filterValue,
        isDisplayed, 
        childrenFacetValues{
          label,
          count,
          value,
          filterValue,
          isDisplayed
        }
      }
    }
    items{
      productCode
    }
}
}



