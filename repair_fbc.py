import os
import psycopg2
import sys

# Konfigurasi dari env.txt lo
CONN_STRING = 'postgresql://postgres:jupkak-fuqjax-vojqI8@db.nlrgdhpmsittuwiiindq.supabase.co:5432/postgres'

def main():
    print("🛠️  Sedang memulai proses perbaikan FBC (Safe Database Repair)...")
    
    try:
        # Connect to Database
        conn = psycopg2.connect(CONN_STRING)
        cur = conn.cursor()
        
        # SQL Update Logic - Mencocokkan FBCLID dari URL log Pixel lo
        sql = """
            UPDATE global_product gp
            SET fbc = sub.recovered_fbc
            FROM (
                SELECT DISTINCT ON (pe.email, pe.phone_number)
                    pe.email,
                    pe.phone_number,
                    'fb.1.' || floor(extract(epoch from gp_inner.created_at) * 1000) || '.' || substring(pe.page_url from 'fbclid=([^&]+)') as recovered_fbc
                FROM pixel_events pe
                JOIN global_product gp_inner ON (pe.email = gp_inner.email OR pe.phone_number = gp_inner.phone)
                WHERE gp_inner.created_at >= '2026-03-26'
                  AND gp_inner.status = 'PAID'
                  AND gp_inner.fbc IS NULL
                  AND pe.page_url ~ 'fbclid='
            ) sub
            WHERE (gp.email = sub.email OR gp.phone = sub.phone_number)
              AND gp.fbc IS NULL
              AND gp.status = 'PAID'
              AND gp.created_at >= '2026-03-26';
        """
        
        print("📡 Menjalankan query pemulihan data...")
        cur.execute(sql)
        updated_count = cur.rowcount
        
        conn.commit()
        
        print("\n" + "="*50)
        print(f"✅ BERHASIL! {updated_count} pesanan telah diperbarui FBC-nya.")
        print("="*50)
        print("💡 Sekarang database lo sudah punya 'Bapak Iklan' buat pesanan tersebut.")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"\n❌ ERROR TERJADI: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
