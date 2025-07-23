import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Methodが許可されていません。 '})
    }

    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User Id が見つかりません '})
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        const { data: authUpdate, error: authError } = await supabaseAdmin
            .auth.admin.updateUserById(userId, {
            user_metadata: { role: 1 }
        });

        if (authError) throw authError;

        const { error: dbError } = await supabaseAdmin
            .from('users')
            .update({ roles: 1 })
            .eq('id', userId);

        if (dbError) throw dbError;

        return res.status(200).json({
            message: 'roleの更新が完了しました。',
            user: authUpdate
        });
    } catch (error) {
        console.error('エラー：', error);
       return res.status(500).json({ error: 'roleの更新に失敗しました' })
    }
}