import { type Context } from '~/types';
import { Layout } from '~/components/Layout';
import { css } from '~/css';

/**
 * This method is used as a fallback for when a route is not found.
 * It is registered in the main index.ts using .onNotFound(notFoundHandler)
 * @see https://www.trifrost.dev/docs/error-notfound-handlers#404-handler-onnotfound
 */
export async function notFoundHandler(ctx: Context) {
  return ctx.html(
    <Layout title={'404 Not Found'}>
      <>
        <h1 className={css.use('title')}>404 Not Found</h1>
        <p>We looked but nothing is here</p>
        <a href="/">Back home</a>
      </>
    </Layout>
  );
}
