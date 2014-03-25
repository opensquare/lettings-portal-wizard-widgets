{
  docBase: "/root",
  defaultInitalData: "new-landlord-initial-data.xml",
  formLists: {
    main: [
    /*
     // call to esb to check availability of email
     {
        id: "emailcheck",
        url: "c-email.html",
        actions: [
          {
            name: "next",
            submission: {
              url: "{{$email-check}}",
              data: "[dataDocument]"
            },
            method: "post",
            resultInsertPoint: "/root/esb"
          }
        ]
     },
    */
      {
        id: "landlord",
        url: "1-landlord.html",
        actions: [ 
          {
            name: "next"/*,
            submission: {
              url: "{{$email-check}}",
              data: "[dataDocument]"
            },
            method: "post",
            resultInsertPoint: "/root/esb"*/
          }
        ]
      },
      {
        id: "register",
        url: "../common-forms/common-welcome-page.html",
        actions: [ "back",
          {
            name: "next",
            submission: {
              url: "{{$script-runner-url}}",
              data: {
                script: "Lettings/script/createLandlordFromFormData.py",
                data: "[dataDocument]"
              },
              method: "post",
              resultInsertPoint: "/root/pact"
            }
          }
        ]},
      {
        id: "welcome",
        url: "../common-forms/common-welcome-page.html"
      }
    ]
  }
}
