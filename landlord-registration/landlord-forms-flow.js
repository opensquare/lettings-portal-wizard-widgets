{
  docBase: "/register",
  defaultInitalData: "new-landlord-initial-data.xml",
  formLists: {
    main: [
      {
        id: "landlord",
        url: "1-landlord.html",
        actions: [ 
          {
            name: "next",
            submission: {
              url: "{{$register-url}}",
              data: {
                postParam: "[dataDocument]",
                paramToEcho: "postParam",
                contentType: "text/xml"
              },
              method: "post",
              resultInsertPoint: "/register/create"
            },
          }
        ]
      },
      {
        id: "register-check",
        url: "../common-forms/register-check.html",
        actions: ["next", "back"]
      },
      {
        id: "welcome",
        url: "../common-forms/common-welcome-page.html"
      }
    ]
  }
}
