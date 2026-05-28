export interface Attachment {
    name: string;
    size: number;
    type: string;
}

export interface MailItem {
    attachment_count: number;
    first_attachment_name: string;
    from_mail: string;
    from_name: string;
    is_new: boolean;
    mail_id: number;
    subject: string;
    time: string;
}

export interface InboxResponse {
    success: boolean;
    error?: string | null;
    count: number;
    first_id: number;
    last_id: number;
    limit: number;
    mail_list: MailItem[];
    more: boolean;
    result: boolean;
}

export interface MailResponse {
    success: boolean;
    error?: string | null;
    attachments: Attachment[];
    date: Date;
    from: string;
    from_is_local: boolean;
    from_mail: string;
    from_name: string;
    html: string;
    is_tls: boolean;
    mail_id: number;
    message_id: string;
    result: boolean;
    subject: string;
    text: string;
    to: string;
}

export interface DeleteResponse {
    success: boolean;
    result: boolean;
    error?: string | null;
}

export interface GeneratedEmail {
    email: string;
    username: string;
    domain: string;
}

export interface TempMailOptions {
    timeout?: number;
}
