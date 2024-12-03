
export const config = {

    fullUrl: "https://elasticsearch.aonprd.com/aon/_search",
    root: "https://elasticsearch.aonprd.com/",
    index: "aon/",
    FieldFethc:  `
    {
      "aggs" : {
          "restList" : {
              "terms" : { "field" : "*replace*", "size":10000 }
          }
      },
      "size" : 0
    }
  `,
}