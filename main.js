/** 
 * Creates the menu item "Mail Merge" for user to run scripts on drop-down.
 */
function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Mail Merge')
        .addItem('Criar Página Email Config', 'createEmailConfig')
        .addItem('Enviar emails', 'emailsFunction')
        .addToUi();
  };
  
  /** 
   * Creates the email config tab with the required columns
   */
  function createEmailConfig() {
      // Creates de email config sheet
        var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
        activeSpreadsheet.insertSheet('Email Config');
    
        var configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Email Config');
        var headers = [['Nome da Página', 'Email', 'Coluna Condicional', 'Condição', 'Assunto do Email', 'Cc', 'Coluna Marcação Envio']];
    
        // Add correct names to the columns
        configSheet.getRange(1,1,1,headers[0].length).setValues(headers);
        headers[0].forEach(function(value, index) {
          configSheet.autoResizeColumn(index+1);
        });
    };
  
  /**
   * Reads all the tabs and columns, build the emails and save what's done
  */
  function emailsFunction() {
  
      // Gets data from the email configuration sheet
      const configRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Email Config').getDataRange();
      const configData = configRange.getDisplayValues();
      // Assumes row 1 contains our column headings
      const configHeads = configData.shift();
      // Converts 2d array into an object array
      const configObj = configData.map(r => (configHeads.reduce((o, k, i) => (o[k] = r[i] || '', o), {})));
  
      // Loop array
      configObj.forEach(function(row) {
          
          // Gets the condition for email
          var emailConditionCol = row['Coluna Condicional'];
          var emailCondition = row['Condição'];
          var emailSentCol = row['Coluna Marcação Envio'];
          var emailRecipientCol = row['Email'];
          var emailSubject = row['Assunto do Email'];
          var emailCc = row['Cc'];
  
          // Gets data for emails
          var emailSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(row['Nome da Página']);
          var emailRange = emailSheet.getDataRange();
          var emailData = emailRange.getDisplayValues();
          var emailSentColIdx = emailRange.getValues()[0].indexOf(emailSentCol);
  
          // Assumes row 1 contains our column headings
          var emailHeads = emailData.shift();
          // Converts 2d array into an object array
          var emailObj = emailData.map(r => (emailHeads.reduce((o, k, i) => (o[k] = r[i] || '', o), {})));
  
          // Creates an array to record sent emails
          var out = [];
  
          // Loop array
          emailObj.forEach(function(row) {
  
              // If the condition in sheet is true
              if (row[emailConditionCol] == emailCondition) {
                  // If email wasn't sent yet
                  if (row[emailSentCol] == '') {
  
                      try {
                          // Gets the draft Gmail message to use as a template
                          var emailTemplate = getGmailTemplateFromDrafts_(emailSubject);
                          // Fill template
                          var msgObj = fillInTemplateFromObject_(emailTemplate.message, row)
  
                          GmailApp.sendEmail(row[emailRecipientCol], msgObj.subject, msgObj.text, {
                              htmlBody: msgObj.html,
                              cc: emailCc,
                              name: 'Abraço Cultural'
                          });
                          // Save email sent date
                          out.push([new Date()]);
                      } catch(e) {
                          // Save error
                          out.push([e.message]);
                      }
                  } else {
                      out.push([row[emailSentCol]]);
                  }
              } else {
                out.push([''])
              };
          });
          // Update sheet with the emails sent dates
          if (out.length > 0) {
              try {
                emailSheet.getRange(2, emailSentColIdx+1, out.length).setValues(out);
              } catch(e) { };
            };
      });
  };
  
  /**
       * Get a Gmail draft message by matching the subject line.
       * @param {string} emailSubject to search for draft message
       * @return {object} containing the subject, plain and html message body and attachments
       */
  function getGmailTemplateFromDrafts_(emailSubject){
      try {
          // Get all Gmail's drafts
          const allDrafts = GmailApp.getDrafts();
          // filter the drafts that match subject line
          const draft = allDrafts.filter(subjectFilter_(emailSubject))[0];
          // get the message object
          const msg = draft.getMessage();
          const htmlBody = msg.getBody(); 
  
          return {message: {subject: emailSubject, text: msg.getPlainBody(), html:htmlBody}};
      } catch(e) {
          throw new Error('Oops - cant find Gmail draft with that subject');
      };
  };
  
  /**
       * Filter draft objects with the matching subject linemessage by matching the subject line.
       * @param {string} emailSubject to search for draft message
       * @return {object} GmailDraft object
  */
  function subjectFilter_(emailSubject){
      return function(element) {
          if (element.getMessage().getSubject() === emailSubject) {
          return element;
          }
      };
  };
  
  /**
       * Fill template string with data object
       * @param {string} template string containing {{}} markers which are replaced with data
       * @param {object} data object used to replace {{}} markers
       * @return {object} message replaced with data
   */
  function fillInTemplateFromObject_(template, data) {
      // We have two templates one for plain text and the html body
      // Stringifing the object means we can do a global replace
      let templateString = JSON.stringify(template);
  
      // Token replacement
      templateString = templateString.replace(/{{[^{}]+}}/g, key => {
          return escapeData_(data[key.replace(/[{}]+/g, "")] || "");
      });
      return  JSON.parse(templateString);
  };
  
  /**
       * Escape cell data to make JSON safe
       * @param {string} str to escape JSON special characters from
       * @return {string} escaped string
   */
  function escapeData_(str) {
      return str
          .replace(/[\\]/g, '\\\\')
          .replace(/[\"]/g, '\\\"')
          .replace(/[\/]/g, '\\/')
          .replace(/[\b]/g, '\\b')
          .replace(/[\f]/g, '\\f')
          .replace(/[\n]/g, '\\n')
          .replace(/[\r]/g, '\\r')
          .replace(/[\t]/g, '\\t');
  };