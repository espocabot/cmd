import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { type FieldValues, type UseFormProps, useForm } from 'react-hook-form';
import type { z } from 'zod';

export function useZodForm<
	T extends z.ZodType<FieldValues, FieldValues>,
	TContext,
>(
	schema: T,
	props?: Omit<UseFormProps<z.input<T>, TContext, z.output<T>>, 'resolver'>,
) {
	return useForm({
		resolver: standardSchemaResolver(schema),
		...props,
	});
}
