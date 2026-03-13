import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';

export default function CustomSelect({ value, onChange, options, placeholder, error, disabled }) {
    const selectedOption = options.find(opt => String(opt.value) === String(value));

    return (
        <Listbox value={value} onChange={onChange} disabled={disabled}>
            <div className="relative mt-1">
                <Listbox.Button className={`relative w-full cursor-pointer rounded-xl bg-white dark:bg-gray-900 border ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} py-3.5 pl-4 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 sm:text-sm`}>
                    <span className={`block truncate ${!selectedOption ? 'text-gray-400' : 'text-gray-900 dark:text-white font-medium'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 text-base shadow-lg border border-gray-100 dark:border-gray-700/50 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {options.map((option, index) => (
                            <Listbox.Option
                                key={index}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${
                                        active ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-gray-200'
                                    }`
                                }
                                value={option.value}
                            >
                                {({ selected, active }) => (
                                    <>
                                        <span className={`block truncate ${selected ? 'font-bold text-primary-600 dark:text-primary-400' : 'font-medium'}`}>
                                            {option.label}
                                        </span>
                                        {selected ? (
                                            <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-primary-600 dark:text-primary-400'}`}>
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
}
