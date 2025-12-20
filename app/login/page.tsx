'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail } from 'lucide-react';
import SiteHeader from '@/components/layout/SiteHeader';

export default function LoginPage() {
    const handleGoogleLogin = () => {
        signIn('google', { callbackUrl: '/' });
    };

    return (
        <div className='min-h-screen flex flex-col items-center bg-gray-100 dark:bg-zinc-950 transition-colors'>
            <SiteHeader session={null} />

            <main className='flex-1 flex items-center justify-center w-full px-4 pb-40'>
                <Card className='
                    w-full max-w-md border-2 shadow-xl 
                    bg-white dark:bg-zinc-900 dark:border-zinc-800
                    -mt-16
                '>
                    <CardHeader className='space-y-1 text-center'>
                        <div className='flex justify-center mb-4'>
                            <div className='p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-primary'>
                                <Mail className='w-8 h-8 text-indigo-600 dark:text-indigo-400' />
                            </div>
                        </div>
                        <CardTitle className='text-2xl font-bold dark:text-gray-100'>로그인</CardTitle>
                        <CardDescription className='dark:text-gray-400'>Manito 서비스를 이용하려면 로그인이 필요합니다.</CardDescription>
                    </CardHeader>

                    <CardContent className='grid gap-4'>
                        <Button variant='outline' className='w-full h-12 text-base font-medium relative dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-700' onClick={handleGoogleLogin}>
                            <svg className='mr-2 h-5 w-5' aria-hidden='true' focusable='false' data-prefix='fab' data-icon='google' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 488 512'>
                                <path fill='currentColor' d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'></path>
                            </svg>
                            Google 계정으로 계속하기
                        </Button>
                    </CardContent>

                    <CardFooter>
                        <Button variant='ghost' className='w-full dark:text-gray-400 dark:hover:text-gray-200' asChild>
                            <Link href='/'>
                                <ArrowLeft className='mr-2 h-4 w-4' />
                                메인 화면으로 돌아가기
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}