// app/routes/api/transcribe.ts
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { unstable_parseMultipartFormData, unstable_createFileUploadHandler } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const uploadHandler = unstable_createFileUploadHandler({
    directory: "/tmp",
    maxPartSize: 10_000_000,
  });

  const formData = await unstable_parseMultipartFormData(request, uploadHandler);
  const file = formData.get("audio") as File;

  console.log("Arquivo recebido:", file.name, file.type, file.size);

  const response = await fetch("http://192.168.15.7:8000/transcribe", {
    method: "POST",
    body: (() => {
      const fd = new FormData();
      fd.append("file", file);
      return fd;
    })(),
  });

  const data = await response.json();
  return json(data);
};
