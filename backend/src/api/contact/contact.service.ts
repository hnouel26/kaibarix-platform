import { Injectable } from '@nestjs/common';

@Injectable()
export class ContactService {
  async submitContact(email: string) {
    // TODO: Implement email sending or database storage
    console.log(`Contact request from: ${email}`);
    return {
      success: true,
      message: 'Thank you for contacting KAIBARIX. We will get back to you soon.',
    };
  }
}
