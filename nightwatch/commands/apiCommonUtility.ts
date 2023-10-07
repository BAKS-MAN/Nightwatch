import request from "supertest";
import { assert } from "chai";
import {
  generateDocumentTitleTimeStamp,
  getFileNameWithExtensionFromPath,
  getPdfTestDocumentPath,
} from "./testDataUtil";

export async function deleteDocumentById(documentId: string) {
  console.log(`Delete document with id: ${documentId} via API call`);
  const deleteResponse = await request(browser.globals.base_url)
    .delete(`/delete-document/${documentId}`)
    .disableTLSCerts()
    .set({
      "Client-id": browser.globals.clientId,
      "Tenant-id": browser.globals.tenantId,
    });
  assert.equal(
    deleteResponse.statusCode,
    204,
    `Delete document via API call status code check failed.\n
    The response body is :\n${JSON.stringify(deleteResponse.body, null, 2)}\n`,
  );
}

export async function uploadPdfDocument() {
  let attachmentPath = getPdfTestDocumentPath();
  console.log("Uploading a PDF file via API call");
  const uploadResponse = await request(browser.globals.base_url)
    .post("/upload-document/")
    .disableTLSCerts()
    .set({
      "Client-id": browser.globals.clientId,
      "Tenant-id": browser.globals.tenantId,
      "Document-title": generateDocumentTitleTimeStamp(),
      "Document-category": browser.globals.categoryId,
      "Content-Disposition": `attachment; filename=${getFileNameWithExtensionFromPath(
        attachmentPath,
      )}`,
      "Content-Type": "application/pdf",
      Accept: "*/*",
    })
    .send(require("fs").readFileSync(attachmentPath));

  assert.equal(
    uploadResponse.statusCode,
    201,
    `Create new document via API call status code check failed.\n
    The response body is :\n${JSON.stringify(uploadResponse.body, null, 2)}\n`,
  );
}
