<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewPropertyAlert extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public $properties,
        public string $unsubscribeToken
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Ada Kos Baru di Kawasan Favorit Anda! 🏠',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.properties.alert',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
