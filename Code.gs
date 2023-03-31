function onOpen() {
  var ui = DocumentApp.getUi();
  ui.createMenu('File Expander')
  .addItem('Open File Expander', 'showSidebar')
  .addToUi();
}


function showSidebar() {
  var html = HtmlService.createTemplateFromFile('sidebar')
      .evaluate()
      .setTitle('File Expander');
  DocumentApp.getUi().showSidebar(html);
}

//called by html file to create a new file
function createFile(parentFolderId)
{
  var fileName = DocumentApp.getUi().prompt('Enter file name:').getResponseText();
  if (fileName==='') {return fileName;}

  var file = {
    title: fileName,
    parents: [{id: parentFolderId}],
    mimeType: 'application/vnd.google-apps.document'
  };
  var createdFile = Drive.Files.insert(file);

  //var url = 'https://docs.google.com/document/d/' + file.id + '/edit';
  //var win = window.open(url, '_blank');
  //win.focus();  

  return fileName;
}


function getFolderTree(folder) {
  var output = [];
  var files = folder.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    output.push({type:'file', name: file.getName(), url: file.getUrl()});
  }
  var subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    var subfolder = subfolders.next();
    //output.push({name: subfolder.getName(), children: getFolderTree(subfolder), id: subfolder.getId()});

    output.push({type:'folder', name: subfolder.getName(), children: getFolderTree(subfolder), id: subfolder.getId(), url: subfolder.getUrl()});
  }
  return output;
}


function getFolderData() {
  var folderName = 'FILE_EXPANDER';
  var folder = DriveApp.getFoldersByName(folderName).next();
  return getFolderTree(folder);
}
