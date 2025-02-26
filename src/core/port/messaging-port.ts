export interface MessagingPort {
    publish(subject: string, data: any): Promise<void>;
    subscribe(subject: string, callback: (data: any) => void): void;
}
  