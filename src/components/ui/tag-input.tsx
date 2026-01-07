'use client';

import { cn } from '@/utils';
import { XIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function TagInput({
  className,
  value,
  onChange,
  ...props
}: Omit<React.ComponentProps<'textarea'>, 'type' | 'value' | 'onChange'> & {
  value?: string[];
  onChange?: (e: { target: { value: string[] } }) => void;
}) {
  const [tags, setTags] = useState<string[]>(value || []);
  const [fieldValue, setFieldValue] = useState<string>('');
  const [indent, setIndent] = useState<number>(0);
  const [top, setTop] = useState<number>(0); // 41px interval

  useEffect(() => {
    if (tags.length > 0) {
      const wrapper = document.getElementById(`wrapper-${props.id}`);

      if (wrapper) {
        const lastTag = wrapper.querySelector('div:last-of-type');
        if (lastTag) {
          const lastTagRect = lastTag.getBoundingClientRect();
          const wrapperRect = wrapper.getBoundingClientRect();

          const newIndent = lastTagRect.right - wrapperRect.left + 4; // 4px gap
          const newTop = lastTagRect.top - wrapperRect.top;

          // eslint-disable-next-line react-hooks/set-state-in-effect
          setIndent(newIndent > wrapperRect.width - 20 ? 0 : newIndent);
          setTop(newIndent > wrapperRect.width - 20 ? newTop + 24 : newTop);
        }
      }
    } else {
      // set indent to 0
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIndent(0);
      setTop(0);
    }

    onChange?.({ target: { value: tags } });
  }, [tags, props.id, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.key === ' ' && fieldValue?.endsWith(',')) || e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();

      if (
        fieldValue?.trim() !== '' &&
        fieldValue.trim() !== ','
        // && !tags.includes(
        //   fieldValue
        //     .trim()
        //     .substring(
        //       0,
        //       fieldValue.lastIndexOf(',') > 0
        //         ? fieldValue.lastIndexOf(',')
        //         : undefined
        //     )
        // )
      ) {
        setTags((prevTags) => [
          ...prevTags,
          fieldValue
            .trim()
            .substring(
              0,
              fieldValue.lastIndexOf(',') > 0
                ? fieldValue.lastIndexOf(',')
                : undefined
            )
            .trim(),
        ]);
        setFieldValue('');
      }
    } else if (e.key === 'Backspace' && fieldValue === '' && tags.length > 0) {
      e.preventDefault();
      e.stopPropagation();

      setTags((prevTags) => prevTags.slice(0, -1)); // Remove last tag
    }
  };

  const handleRemoveClick =
    (tagIndex: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setTags((prevTags) => prevTags.filter((_, index) => index !== tagIndex));
    };

  return (
    <div
      aria-invalid={props['aria-invalid']}
      className={cn(
        'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input min-h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'relative grid',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
      )}>
      <div
        id={`wrapper-${props.id}`}
        className="inline-flex items-center gap-2 flex-wrap max-h-min row-1 col-1">
        {tags.map((tag, i) => (
          <div
            key={i}
            className="pl-3 pr-2 py-0.5 bg-primary/5 rounded-full shadow-xs grid grid-cols-[auto_1fr] gap-2 items-center z-20">
            <span className="text-sm">{tag}</span>
            <button onClick={handleRemoveClick(i)}>
              <XIcon className="size-3" />
            </button>
          </div>
        ))}
      </div>
      <textarea
        // type="text"
        style={{ textIndent: indent, paddingTop: top }}
        autoComplete="off"
        value={fieldValue}
        onChange={(e) => setFieldValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className={cn(
          'focus-visible:outline-none md:text-sm w-full resize-none overflow-visible bg-transparent m-px h-min inline-block leading-6 z-10 row-1 col-1',
          className
        )}
        {...props}
        required={false}
      />
    </div>
  );
}
