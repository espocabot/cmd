import type { Control } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type { EndpointParam, EndpointQueryParam } from '@/lib/endpoints';
import type { CommandGeneratorFormData } from './command-generator';

type Props = {
	control: Control<CommandGeneratorFormData>;
} & (
	| { type: 'param'; param: EndpointParam }
	| { type: 'query'; queryParam: EndpointQueryParam }
);

export function EndpointParamField(props: Props) {
	if (props.type === 'param') {
		return <RouteParam param={props.param} />;
	}

	return <QueryParam queryParam={props.queryParam} />;
}

function RouteParam({ param }: { param: EndpointParam }) {
	const { control } = useFormContext<CommandGeneratorFormData>();
	return (
		<Controller
			control={control}
			name={`endpointParams.${param.id}`}
			rules={{
				required: param.required ? 'Este campo é obrigatório' : false,
				minLength:
					param.type === 'text' && param.minLength
						? {
								value: param.minLength,
								message: `Mínimo de ${param.minLength} caracteres`,
							}
						: undefined,
				maxLength:
					param.type === 'text' && param.maxLength
						? {
								value: param.maxLength,
								message: `Máximo de ${param.maxLength} caracteres`,
							}
						: undefined,
			}}
			render={({ field }) => (
				<Field>
					<FieldContent>
						<FieldLabel>
							{param.label}
							{param.required ? '*' : ''}
						</FieldLabel>

						{param.description ? (
							<FieldDescription>{param.description}</FieldDescription>
						) : null}
					</FieldContent>

					{param.type === 'text' ? (
						<Input {...field} placeholder={param.placeholder} />
					) : (
						<Select onValueChange={field.onChange} value={field.value}>
							<SelectTrigger>
								<SelectValue placeholder={param.placeholder} />
							</SelectTrigger>
							<SelectContent>
								{param.options.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				</Field>
			)}
		/>
	);
}

function QueryParam({ queryParam }: { queryParam: EndpointQueryParam }) {
	const { control } = useFormContext<CommandGeneratorFormData>();
	return (
		<Controller
			control={control}
			name={`endpointQueryParams.${queryParam.id}`}
			rules={{
				minLength:
					queryParam.type === 'text' && queryParam.minLength
						? {
								value: queryParam.minLength,
								message: `Mínimo de ${queryParam.minLength} caracteres`,
							}
						: undefined,
				maxLength:
					queryParam.type === 'text' && queryParam.maxLength
						? {
								value: queryParam.maxLength,
								message: `Máximo de ${queryParam.maxLength} caracteres`,
							}
						: undefined,
			}}
			render={({ field }) => (
				<Field>
					<FieldContent>
						<div className="flex items-center gap-2">
							<FieldLabel>{queryParam.label}</FieldLabel>
							<Badge variant="outline">Query Param</Badge>
						</div>

						{queryParam.description ? (
							<FieldDescription>{queryParam.description}</FieldDescription>
						) : null}
					</FieldContent>

					{queryParam.type === 'text' ? (
						<Input {...field} placeholder={queryParam.placeholder} />
					) : (
						<Select onValueChange={field.onChange} value={field.value}>
							<SelectTrigger>
								<SelectValue placeholder={queryParam.placeholder} />
							</SelectTrigger>
							<SelectContent>
								{queryParam.options.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				</Field>
			)}
		/>
	);
}
