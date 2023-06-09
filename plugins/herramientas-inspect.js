import * as baileys from '@adiwajshing/baileys'

let handler = async (m, { conn, text }) => {
	let [, code] = text.match(/chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i) || []
	if (!code) throw '*⚠️ Ingrese el link de un grupo*'
	let res = await conn.query({ tag: 'iq', attrs: { type: 'get', xmlns: 'w:g2', to: '@g.us' }, content: [{ tag: 'invite', attrs: { code } }] }),
		data = extractGroupMetadata(res),
		txt = Object.keys(data).map(v => `*${v.capitalize()}:* ${data[v]}`).join('\n'),
		pp = await conn.profilePictureUrl(data.id, 'image').catch(console.error)
		let groupinfo = `
*┏━━━━━━━━━━━━━━━┓*
┃☂️ ⫹⫺ 𝐈𝐃 : ${data.id}◞
┃🧪 ⫹⫺ 𝐍𝐎𝐌𝐁𝐑𝐄 : ${data.subject}
┃📅 ⫹⫺ 𝐂𝐑𝐄𝐀𝐃𝐎 : ${data.creation}
┃👑 ⫹⫺ 𝐎𝐖𝐍𝐄𝐑 : ${data.owner}
*┗━━━━━━━━━━━━━━━┛*
`
	await conn.reply(m.chat, groupinfo, m)
	const botones = [
{index: 1, urlButton: {displayText: `𝙲𝙾𝙿𝙸𝙰𝚁 𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝙲𝙸𝙾𝙽 🍓`, url: `https://www.whatsapp.com/otp/copy/${data.desc}`}},
]
await conn.sendMessage(m.chat, { text: `*┏━━━━━━━━━━━━━━┓*\n┃¿𝙳𝙴𝚂𝙴𝙰 𝙲𝙾𝙿𝙸𝙰𝚁 𝙻𝙰 𝙳𝙴𝚂𝙲𝚁𝙸𝙿? •🌷\n*┗━━━━━━━━━━━━━━┛*`, templateButtons: botones, footer: wm })
}
handler.command = /^(inspect)$/i

export default handler
handler.owner = false

const extractGroupMetadata = (result) => {
	const group = baileys.getBinaryNodeChild(result, 'group')
	const descChild = baileys.getBinaryNodeChild(group, 'description')
	let desc
	if (descChild) desc = baileys.getBinaryNodeChild(descChild, 'body')?.content
	const metadata = {
		id: group.attrs.id.includes('@') ? group.attrs.id : baileys.jidEncode(group.attrs.id, 'g.us'),
		subject: group.attrs.subject,
		creation: new Date(+group.attrs.creation * 1000).toLocaleString('id', { timeZone: 'America/Los_Angeles' }),
		owner: group.attrs.creator ? 'wa.me/' + baileys.jidNormalizedUser(group.attrs.creator).split('@')[0] : undefined,
		desc
	}
	return metadata
}
