import { readFileSync } from "node:fs";
import { v4 as uuidv4 } from "uuid";
import { PKPass } from "passkit-generator";

async function createPass(label: string, toEncode: string) {
  const routeDir = `${process.cwd()}/app/generate`;
  const wwdr = readFileSync(`${routeDir}/certs/apple-wwdr.pem`);
  const signerCert = readFileSync(`${routeDir}/certs/signerCert.pem`);
  const signerKey = readFileSync(`${routeDir}/certs/signerKey.pem`);

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
