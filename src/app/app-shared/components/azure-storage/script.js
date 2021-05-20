sharedComponents.component("azureStorage", {
  templateUrl: "/mix-app/views/app-shared/components/azure-storage/view.html",
  bindings: {
    data: "=",
    width: "=",
  },
  controller: [
    "$rootScope",
    function ($rootScope) {
      var ctrl = this;
      ctrl.blobSasUrl = "<placeholder>";
      ctrl.blobServiceClient = new BlobServiceClient(blobSasUrl);
      ctrl.containerName = "container" + new Date().getTime();
      ctrl.containerClient = blobServiceClient.getContainerClient(
        containerName
      );

      const fileInput = document.getElementById("azure-file-input");
      const status = document.getElementById("status");
      const fileList = document.getElementById("file-list");

      const reportStatus = (message) => {
        status.innerHTML += `${message}<br/>`;
        status.scrollTop = status.scrollHeight;
      };

      ctrl.$onInit = function () {};

      ctrl.createContainer = async () => {
        try {
          reportStatus(`Creating container "${containerName}"...`);
          await containerClient.create();
          reportStatus(`Done.`);
        } catch (error) {
          reportStatus(error.message);
        }
      };

      ctrl.deleteContainer = async () => {
        try {
          reportStatus(`Deleting container "${containerName}"...`);
          await containerClient.delete();
          reportStatus(`Done.`);
        } catch (error) {
          reportStatus(error.message);
        }
      };

      ctrl.listFiles = async () => {
        fileList.size = 0;
        fileList.innerHTML = "";
        try {
          reportStatus("Retrieving file list...");
          let iter = containerClient.listBlobsFlat();
          let blobItem = await iter.next();
          while (!blobItem.done) {
            fileList.size += 1;
            fileList.innerHTML += `<option>${blobItem.value.name}</option>`;
            blobItem = await iter.next();
          }
          if (fileList.size > 0) {
            reportStatus("Done.");
          } else {
            reportStatus("The container does not contain any files.");
          }
        } catch (error) {
          reportStatus(error.message);
        }
      };

      ctrl.uploadFiles = async () => {
        try {
          reportStatus("Uploading files...");
          const promises = [];
          for (const file of fileInput.files) {
            const blockBlobClient = containerClient.getBlockBlobClient(
              file.name
            );
            promises.push(blockBlobClient.uploadBrowserData(file));
          }
          await Promise.all(promises);
          reportStatus("Done.");
          listFiles();
        } catch (error) {
          reportStatus(error.message);
        }
      };

      ctrl.deleteFiles = async () => {
        try {
          if (fileList.selectedOptions.length > 0) {
            reportStatus("Deleting files...");
            for (const option of fileList.selectedOptions) {
              await containerClient.deleteBlob(option.text);
            }
            reportStatus("Done.");
            listFiles();
          } else {
            reportStatus("No files selected.");
          }
        } catch (error) {
          reportStatus(error.message);
        }
      };
    },
  ],
});
