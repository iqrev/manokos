<?php

namespace App\Console\Commands;

use App\Mail\NewPropertyAlert;
use App\Models\Property;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendPropertyAlerts extends Command
{
    protected $signature = 'manokos:send-alerts';
    protected $description = 'Send email alerts for new properties based on user preferences';

    public function handle()
    {
        $this->info('Starting to send property alerts...');

        // 1. Get properties added in the last 24 hours
        $newProperties = Property::where('created_at', '>=', Carbon::now()->subDays(1))
            ->where('status', 'active')
            ->get();

        if ($newProperties->isEmpty()) {
            $this->info('No new properties found in the last 24 hours.');
            return;
        }

        // 2. Get users who want to be notified
        $users = User::whereHas('preferences', function ($query) {
            $query->where('notify_email', true);
        })->with('preferences')->get();

        $count = 0;
        foreach ($users as $user) {
            $preferredAreas = $user->preferences->preferred_areas ?: [];
            
            // Filter properties that match user's preferred areas
            $matchingProperties = $newProperties->filter(function ($property) use ($preferredAreas) {
                return empty($preferredAreas) || in_array($property->area, $preferredAreas);
            });

            if ($matchingProperties->isNotEmpty()) {
                Mail::to($user->email)->send(new NewPropertyAlert(
                    $user,
                    $matchingProperties,
                    $user->preferences->unsubscribe_token
                ));
                $count++;
            }
        }

        $this->info("Successfully sent alerts to $count users.");
    }
}
