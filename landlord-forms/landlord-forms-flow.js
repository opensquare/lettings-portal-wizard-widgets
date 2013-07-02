{
  docBase: "/root",
  defaultInitalData: "new-landlord-initial-data.xml",
  formLists: {
    main: [
      {
        id: "landlord",
        url: "1-landlord.html",
        actions: [ "next" ]
      },
      {
        id: "register",
        url: "registration.html",
        actions: [
          { "back",
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
      },
      {
        id: "welcome",
        url: "../common-forms/common-welcome-page.html"
      }
    ]
  }
}