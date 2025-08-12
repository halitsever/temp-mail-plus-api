export interface InboxResponse {
    success: boolean,
    error?: any,
    count: number,
    first_id: number,
    last_id: number,
    limit: number,
    mail_list: [
        {
            attachment_count: number,
            first_attachment_name: string,
            from_mail: string,
            from_name: string,
            is_new: boolean,
            mail_id: number,
            subject: string,
            time: string
        }
    ],
    more: boolean,
    result: boolean
}


export interface MailResponse {
    error?: any,
    success: boolean,
    attachments: [],
    date: Date,
    from: string,
    from_is_local: boolean,
    from_mail: string,
    from_name: string,
    html: string,
    is_tls: boolean,
    mail_id: number,
    message_id: string,
    result: boolean,
    subject: string,
    text: string,
    to: string,
}