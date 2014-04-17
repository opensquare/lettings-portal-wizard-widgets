{
  docBase: "/user",
  formLists: {
    main: [
      {
        id: "init",
        url: "../common-forms/initialisation.html",
        actions: [
          {
            name: "retrieve",
            type: "next",
            submission: {
              url: "{{$user-details-retrieve}}", /*{{//userId}} and {{//userTypeId}} may need to be injected in to url restfully*/
              data: {
                userId: "xpath://user/userId",
                userTypeId: "xpath://user/userTypeId"
              },
              method: "get",
              resultInsertPoint: "/"
            }
          }
        ]
      },
      {
        id: "edit",
        url: "user-profile-details.html",
        actions: [ 
          {
            name: "next", 
            submission: {
              url: "{{$user-details-save}}",
              data: {
                /* will need updating */
                submissionParamName : "[dataDocument]",
                /* ** following are temporary parameters ***/
                paramToEcho: "submissionParamName",
                contentType: "text/xml"
                /* ** ***/
              },
              method: "post",
              resultInsertPoint: "/user/save"
            }
          }
        ]
      },
      {
        id: "welcome",
        url: "../common-forms/save-complete.html"
      }
    ]
  }
}