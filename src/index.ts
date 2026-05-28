import HttpClient from "./http.client";
import { DeleteResponse, GeneratedEmail, InboxResponse, MailResponse, TempMailOptions } from "./types";

export const TEMP_MAIL_DOMAINS = [
    "mailto.plus",
    "fexpost.com",
    "fexbox.org",
    "mailbox.in.ua",
    "rover.info",
    "chitthi.in",
    "fextemp.com",
    "any.pink",
    "merepost.com"
] as const;

export type TempMailDomain = typeof TEMP_MAIL_DOMAINS[number];

export default class TempMailInstance {
    private readonly httpClient: HttpClient;
    private emailAddress: string;

    constructor(email: string, options?: TempMailOptions) {
        this.validateEmail(email);
        this.httpClient = new HttpClient(options);
        this.emailAddress = email;
    }

    static generateEmail(username?: string, domain?: TempMailDomain): GeneratedEmail {
        const resolvedUsername = username ?? randomString(8);
        const resolvedDomain = domain ?? TEMP_MAIL_DOMAINS[Math.floor(Math.random() * TEMP_MAIL_DOMAINS.length)];
        return {
            email: `${resolvedUsername}@${resolvedDomain}`,
            username: resolvedUsername,
            domain: resolvedDomain
        };
    }

    setEmail(email: string): void {
        this.validateEmail(email);
        this.emailAddress = email;
    }

    async fetchInbox(): Promise<Partial<InboxResponse>> {
        try {
            const data = await this.httpClient.get<InboxResponse>(`/mails?email=${this.emailAddress}`);
            return { error: null, ...data, success: true };
        } catch (error) {
            return { error: errorMessage(error), success: false };
        }
    }

    async fetchMailById(mail_id: number): Promise<Partial<MailResponse>> {
        try {
            const data = await this.httpClient.get<MailResponse>(`/mails/${mail_id}?email=${encodeURIComponent(this.emailAddress)}`);
            return { ...data, success: true };
        } catch (error) {
            return { error: errorMessage(error), success: false };
        }
    }

    async deleteMailById(mail_id: number, epin: string = ''): Promise<Partial<DeleteResponse>> {
        try {
            const data = await this.httpClient.delete<DeleteResponse>(`/mails/${mail_id}`, { email: this.emailAddress, epin });
            return { ...data, success: true };
        } catch (error) {
            return { error: errorMessage(error), success: false };
        }
    }


private validateEmail(email: string): void {
        if (!email.includes('@')) {
            throw new Error(`Invalid email address: "${email}"`);
        }
    }
}

function randomString(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function errorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}
