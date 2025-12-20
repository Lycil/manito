'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DeleteAddressButton({ addressId }: { addressId: string }) {
    const router = useRouter();
    const pathname = usePathname();

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm('정말 이 주소를 삭제하시겠습니까?\n해당 주소로 받은 메일도 모두 삭제됩니다.')) {
            return;
        }

        try {
            const res = await fetch(`/api/address?id=${addressId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                if (pathname.includes(addressId)) {
                    router.push('/mailbox');
                }

                router.refresh();
            } else {
                alert('삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error(error);
            alert('오류가 발생했습니다.');
        }
    };

    return (
        <Button variant='ghost' size='icon' className='h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30' onClick={handleDelete} title='주소 삭제'>
            <Trash2 className='h-4 w-4' />
        </Button>
    );
}
