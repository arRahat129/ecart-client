import { Spinner } from '@heroui/react';
export default function LoadingSpinner() {
    return <div className="flex justify-center items-center min-h-50">
        <Spinner size="lg" color='accent' />
    </div>;
}