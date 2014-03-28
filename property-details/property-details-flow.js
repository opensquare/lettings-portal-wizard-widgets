{
  docBase: "/root",
  formLists: {
    main: [
      {
        id: "initialisation",
          url: "../common-forms/initialisation.html",
          actions: ["next",
            {
              name: "retrieve",
              target: "edit"/*,
              submission: {
                url: "{ {$esb-url}}/property/details/{ {/root/id}}",
                method: "get",
                resultInsertPoint: "/root"
              }*/
            }
         ]
      },
      {
        id: "edit", docBase:"/root/property",
        url: "property-edit.html",
        actions: [ 
          {
            name: "next"/*,
            submission: {
              url: "{ {$esb-url}}/property/details/update/{{/root/id}}",
              method: "post",
              resultInsertPoint: "/root/esb"
            }*/
          }
        ]
      },
      {
        id: "nextStep", docBase:"/root/property",
        url: "../common-forms/save-complete.html",
        actions: ["back"]
      }
    ]
  }
}