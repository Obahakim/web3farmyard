import { createClient } from '@supabase/supabase-js'

export function Hydrate(table: string, filter: string) {


    if (!process.env.NEXT_PUBLIC_SUPA_URL || !process.env.NEXT_PUBLIC_SUPA_KEY) {
        return
    }
    const db = createClient(process.env.NEXT_PUBLIC_SUPA_URL, process.env.NEXT_PUBLIC_SUPA_KEY)

    return new Promise<any>((resolve, reject) => {
        db.from(table).select(filter)
            .then(({ data }) => {
                resolve(data)
            })
    })
}