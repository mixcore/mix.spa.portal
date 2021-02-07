References
 - Git Hub References
    + https://github.com/google/google-api-javascript-client
 - Api Documents
    + https://developers.google.com/analytics/devguides/reporting/embed/v1/

1. Create Consent screen
https://console.developers.google.com/apis/credentials/consent

2. Create OAuth ClientId
    + https://console.developers.google.com/apis/credentials/oauthclient
    + Ex: 981468314766-maemv1ecdqbilkthu523o65v2oem156m.apps.googleusercontent.com
    + Update this to configuration ('Google_Client_Id')


3. Enable ga api
https://console.developers.google.com/apis/library/analytics.googleapis.com

4. Goto https://analytics.google.com/analytics/web/#/a143024037w204328012p197751324/admin/view/settings
get the view Id then update to Google_Analytic_Ids
Ex: ga:[view_id]
