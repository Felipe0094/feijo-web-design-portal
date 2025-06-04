declare module "https://deno.land/std@0.177.0/http/server.ts" {
  export function serve(handler: (req: Request) => Promise<Response>): void;
}

declare module "https://esm.sh/resend@2.0.0" {
  export class Resend {
    constructor(apiKey: string);
    emails: {
      send(data: {
        from: string;
        to: string[];
        subject: string;
        html: string;
        attachments?: Array<{
          filename: string;
          content: string | Buffer;
          content_type: string;
        }>;
      }): Promise<any>;
    };
  }
}

interface PolicyFile {
  name?: string;
  content: string | Buffer;
  type?: string;
}

interface EmailData {
  from: string;
  to: string[];
  subject: string;
  html: string;
  attachments: Array<{
    filename: string;
    content: string | Buffer;
    content_type: string;
  }>;
} 