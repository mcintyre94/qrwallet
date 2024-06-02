import { v4 as uuidv4 } from "uuid";
import { PKPass } from "passkit-generator";

import * as certs from "./certs.enc";
import { decrypt } from "../../encrypt/encryption";

async function createPass(key: Buffer, label: string, toEncode: string) {
  const routeDir = `${process.cwd()}/app/generate`;
  const wwdr = decrypt({ data: certs.wwdr, key });
  const signerCert = decrypt({ data: certs.signerCert, key });
  const signerKey = decrypt({ data: certs.signerKey, key });

  const pass = await PKPass.from(
    {
      /**
       * Note: .pass extension is enforced when reading a
       * model from FS, even if not specified here below
       */
      model: `${routeDir}/Generic.pass`,
      certificates: {
        wwdr,
        signerCert,
        signerKey,
        signerKeyPassphrase: "qrwallet",
      },
    },
    {
      // keys to be added or overridden
      serialNumber: uuidv4(),
      description: `A pass for ${label}`,
    }
  );

  pass.headerFields.push({
    key: "header.name",
    label: "",
    value: label,
  });

  pass.primaryFields.push({
    key: "primary.name",
    label: "",
    value: label,
  });

  pass.setBarcodes({
    message: toEncode,
    format: "PKBarcodeFormatQR",
  });

  return pass;
}

export async function GET(request: Request) {
  const secretsKeyBase64 = process.env.SECRETS_KEY;
  if (!secretsKeyBase64) {
    return Response.json(
      {
        error: "Missing certificate decryption key",
      },
      {
        status: 500,
      }
    );
  }
  const secretsKey = Buffer.from(secretsKeyBase64, "base64");

  const url = new URL(request.url);
  const label = url.searchParams.get("label");
  if (!label) {
    return Response.json(
      {
        error: "Missing label query param",
      },
      {
        status: 400,
      }
    );
  }

  const toEncode = url.searchParams.get("toEncode");
  if (!toEncode) {
    return Response.json(
      {
        error: "Missing toEncode query param",
      },
      {
        status: 400,
      }
    );
  }

  const pass = await createPass(
    secretsKey,
    decodeURIComponent(label),
    decodeURIComponent(toEncode)
  );

  return new Response(pass.getAsBuffer(), {
    headers: {
      "Content-Type": "application/vnd.apple.pkpass",
      "Content-Disposition": 'attachment; filename="barcode.pkpass"',
    },
  });
}
