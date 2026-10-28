import { AsyncLocalStorage } from 'async_hooks';
import { Provider } from '@nestjs/common';

export interface TenantContext {
    tenantId: string;
}

export const TENANT_CONTEXT = 'TENANT_CONTEXT';

export const tenantContextProvider: Provider = {
    provide: TENANT_CONTEXT,
    useValue: new AsyncLocalStorage<TenantContext>(),
};