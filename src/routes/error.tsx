import { type Context } from '~/types';
import { Layout } from '~/components/Layout';
import { css } from '~/css';

/**
 * This method is used as a fallback for when a route errors out, throws an error or
 * a 4/5xx non 404 status is found.
 *
 * It is registered in the main index.ts using .onError(errorHandler)
 *
 * @see https://www.trifrost.dev/docs/error-notfound-handlers#error-handler-onerror
 */
export async function errorHandler(ctx: Context) {
  return ctx.html(
    <Layout title={`Oops: ${ctx.statusCode}`}>
      <>
        <h1 className={css.use('title')}>Oops!</h1>
        <p>Looks like something went wrong (code:{ctx.statusCode})</p>
        <a href="/">Back to safety</a>
      </>
    </Layout>
  );
}
