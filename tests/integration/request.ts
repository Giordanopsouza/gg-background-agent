import http from "node:http";
import net from "node:net";
import type { AddressInfo } from "node:net";

export type RawResponse = {
  status: number;
  headers: http.IncomingHttpHeaders;
  body: string;
};

export async function findFreePort(host = "127.0.0.1"): Promise<number> {
  return await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen({ host, port: 0, exclusive: true }, () => {
      const address = server.address();
      if (!isAddressInfo(address)) {
        server.close();
        reject(new Error("Could not determine a free port"));
        return;
      }

      const { port } = address;
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(port);
      });
    });
    server.on("error", reject);
  });
}

export async function rawRequest(options: {
  host: string;
  port: number;
  method?: string;
  path: string;
  headers?: Record<string, string>;
  body?: string | Buffer;
}): Promise<RawResponse> {
  return await new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: options.host,
        port: options.port,
        method: options.method ?? "GET",
        path: options.path,
        headers: options.headers,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => {
          chunks.push(chunk);
        });
        res.on("end", () => {
          resolve({
            status: res.statusCode ?? 0,
            headers: res.headers,
            body: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );
    req.on("error", reject);
    if (options.body === undefined) {
      req.end();
      return;
    }
    req.end(options.body);
  });
}

function isAddressInfo(
  address: string | AddressInfo | null,
): address is AddressInfo {
  return typeof address === "object" && address !== null;
}
