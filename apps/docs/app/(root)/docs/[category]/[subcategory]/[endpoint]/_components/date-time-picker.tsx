'use client';

import { format, isValid, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
	value?: string;
	onChange: (value: string) => void;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
	const date = value ? parseISO(value) : undefined;
	const [timeValue, setTimeValue] = React.useState(
		date && isValid(date) ? format(date, 'HH:mm') : '00:00',
	);

	const handleDateSelect = (selectedDate: Date | undefined) => {
		if (!selectedDate) return;

		const [hours, minutes] = timeValue.split(':').map(Number);
		const newDate = new Date(selectedDate);
		newDate.setHours(hours || 0);
		newDate.setMinutes(minutes || 0);
		newDate.setSeconds(0);

		onChange(newDate.toISOString());
	};

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTime = e.target.value;
		setTimeValue(newTime);

		if (date && isValid(date)) {
			const [hours, minutes] = newTime.split(':').map(Number);
			const newDate = new Date(date);
			newDate.setHours(hours || 0);
			newDate.setMinutes(minutes || 0);
			newDate.setSeconds(0);
			onChange(newDate.toISOString());
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant={'outline'}
						className={cn(
							'w-full justify-start text-left font-normal',
							!date && 'text-muted-foreground',
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date && isValid(date) ? (
							format(date, "PPP 'às' HH:mm")
						) : (
							<span>Selecione uma data</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={date}
						onSelect={handleDateSelect}
						initialFocus
					/>
					<div className="border-border border-t p-3">
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4 text-muted-foreground" />
							<span className="font-medium text-sm">Horário</span>
							<Input
								type="time"
								value={timeValue}
								onChange={handleTimeChange}
								className="h-8 w-[120px]"
							/>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
