import HttpClient from "./http.client";
import { InboxResponse, MailResponse } from "./types";

export default class TempMailInstance {
    private readonly httpClient: HttpClient;

    private emailAddress: string;

    constructor(email: string) {
        this.httpClient = new HttpClient();
        this.emailAddress = email;
    }


    setEmail(email: string): void {
        this.emailAddress = email;
    }

    async fetchInbox(): Promise<Partial<InboxResponse>> {
        try {
            const data = await this.httpClient.get<InboxResponse>(`/mails?email=${this.emailAddress}`);
            return { error: false, ...data, success: true }
        }
        catch (error) {
            return { error, success: false };
        }
    };

    async fetchMailById(mail_id: number): Promise<Partial<MailResponse>> {
        try {
            const data = await this.httpClient.get<MailResponse>(`/mails/${mail_id}?email=${encodeURIComponent(this.emailAddress)}`);
            return { ...data, success: true };
        }
        catch (error) {
            return { error, success: false }
        }
    }

    static getMailDomains(): string[] {
        return [
            "mailto.plus",
            "fexpost.com",
            "fexbox.org",
            "mailbox.in.ua",
            "rover.info",
            "chitthi.in",
            "fextemp.com",
            "any.pink",
            "merepost.com"
        ];
    }

    getMailDomains(): string[] {
        return this.getMailDomains();
    }
}