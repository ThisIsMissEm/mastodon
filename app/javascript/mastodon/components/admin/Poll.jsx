import { useEffect, useState } from 'react';

import { Provider as ReduxProvider } from 'react-redux';

import { importFetchedPoll } from '@/mastodon/actions/polls';
import { store } from '@/mastodon/store';
// import type { ApiPollJSON } from 'mastodon/api_types/polls'
import { Poll as PollComponent } from 'mastodon/components/poll';

// interface PollProps {
//   poll: ApiPollJSON
// }

export default ({ poll }) => {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    store.dispatch(importFetchedPoll({ poll: { ...poll, voted: true } })).then(() => {
      setShouldRender(true);
    })
  }, [poll])

  return (
    <ReduxProvider store={store}>
      { shouldRender && <PollComponent pollId={poll.id} disabled /> }
    </ReduxProvider>
  );
}
