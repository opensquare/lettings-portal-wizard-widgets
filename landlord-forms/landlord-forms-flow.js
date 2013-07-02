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
        actions: [ "back","next" ]
      },
      {
        id: "welcome",
        url: "../common-forms/common-welcome-page.html"
      }
    ]
  }
}