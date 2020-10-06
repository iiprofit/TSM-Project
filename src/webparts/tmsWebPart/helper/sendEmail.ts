/**
 * SPHttp Package Import.
 * Both Packages Are Used For Configuration.
 * 
 */
import { SPHttpClientConfiguration, SPHttpClient } from "@microsoft/sp-http";

/**
 * Parameters For CreateItemParams Method
 */
type ItemParam = {
  absoluteUrl: string;
  emailBody: EmailBody;
};

/**
 * These Are Types Of Above Parameters.
 */
type sendEmail = {
  url: string;
  config: SPHttpClientConfiguration;
  options: any;
};

/**
 * These Are Email Body Fields.
 */
type EmailBody = {
  From: string;
  To: string[];
  Body: string;
  Subject: string;
};

/**
 * This Is Re-Usable Method.
 * Developer Needs To Only Pass URL And Email Body(Data) Then This Method Automatically Send Email On Specified Person.
 * You Can Consider This As Global Method For Sending Email.
 */
export const sendEmailParams = ({
  absoluteUrl,
  emailBody
}: ItemParam): sendEmail => {
  const url = `${absoluteUrl}/_api/SP.Utilities.Utility.SendEmail`;
  const data = {
    body: JSON.stringify({
      properties: {
        ...emailBody,
        To: emailBody.To
      }
    })
  };
  return {
    url: url,
    config: SPHttpClient.configurations.v1,
    options: data
  };
};
