import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export function initializeSentry(configService: ConfigService) {
  const dsn = configService.get<string>('SENTRY_DSN');

  if (!dsn) {
    console.warn(
      'Sentry DSN not found in environment variables. Sentry will not be initialized.',
    );
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });
}
