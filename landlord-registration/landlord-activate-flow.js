{
  docBase: "/root",
  formLists: {
    main: [
    /*
     // call to esb to get username and do any server side processing on activation
     {
        id: "emailcheck",
        url: "activate.html",
        actions: [
          {
            name: "next",
            submission: {
              url: "{{activate}}",
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
        url: "a-login.html"
      }
    ]
  }
}
