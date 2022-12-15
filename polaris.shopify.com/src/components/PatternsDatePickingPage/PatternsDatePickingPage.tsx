import React, {useEffect, useState} from 'react';
import {Tab} from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import StatusBadge from '../StatusBadge';
import {StatusName} from '../../types';
import PageMeta from '../PageMeta';
import {Stack, Row} from '../Stack';
import {Lede} from '../Lede';
import {Heading} from '../Heading';
import Preview from '../PatternThumbnailPreview';
import {TableContainer, Table, Tbody, TableCaption, Tr, Td} from '../Table';
import PatternsExample, {type PatternExample} from '../PatternsExample';
import Page from '../Page';
import styles from './PatternsDatePickingPage.module.scss';
import {Grid, GridItem} from '../Grid';

type Pattern = {
  index: number;
  description?: string;
  title: string;
  slug: string;
  designDecisionListItems?: string[];
  designDecisions?: {
    listItems?: string[];
    image?: boolean;
  };
  example: PatternExample;
};
const title = 'Date picking';

const newDiscussionLink = `https://github.com/Shopify/polaris/discussions/7852`;
const patternsIndex = ['single-date', 'date-range', 'date-list'];
const patterns: Record<string, Pattern> = {
  'single-date': {
    index: 0,
    title: 'Single date',
    slug: 'single-date',
    description:
      'This enables merchants to type a specific date or pick it from a calendar.',
    example: {
      code: `
    {(function DatePickerPattern () {
      const [{month, year}, setDate] = useState({month: 1, year: 2018});
      const [selectedDates, setSelectedDates] = useState({
        start: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
        end: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
      });
      const handleMonthChange = useCallback(
        (month, year) => setDate({month, year}),
        [],
      );
      return (
        <DatePicker
          month={month}
          year={year}
          onChange={setSelectedDates}
          onMonthChange={handleMonthChange}
          selected={selectedDates}
        />
      );
    })()}`,
      context: `
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: '32px',
      paddingRight: '32px',
    }}>
      <div style={{ width: '100%' }}>
        ____CODE____
      </div>
    </div>
    `,
      snippetCode: `
    function DatePickerPattern () {
      const [{month, year}, setDate] = useState({month: 1, year: 2018});
      const [selectedDates, setSelectedDates] = useState({
        start: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
        end: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
      });
      const handleMonthChange = useCallback(
        (month, year) => setDate({month, year}),
        [],
      );
      return (
        <DatePicker
          month={month}
          year={year}
          onChange={setSelectedDates}
          onMonthChange={handleMonthChange}
          selected={selectedDates}
        />
      );
    }
        `,
    },
  },
  'date-range': {
    index: 1,
    title: 'Date range',
    slug: 'date-range',
    description: 'This enables merchants to select a date range.',
    example: {
      code: ` <Page
      divider
    >
      <AlphaStack gap="16">
        Coming Soon
      </AlphaStack>
    </Page>`,
    },
  },
  'date-list': {
    index: 2,
    title: 'Date list',
    slug: 'date-list',
    description:
      'This enables merchants to select a date or a date range from a list of preset dates.',
    example: {
      context: `<div style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: '32px',
        paddingRight: '32px',
      }}>
        <div style={{ width: '100%' }}>
          ____CODE____
        </div>
      </div>`,
      code: `
      <Page
      divider
    >
      <AlphaStack gap="16">
        Coming Soon
      </AlphaStack>
    </Page>
      `,
    },
  },
};

export default function PatternsDatePickingPage() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const {query, replace, isReady} = useRouter();
  const onTabChange = (index: number) => {
    setExampleIndex(index);
    replace(
      {
        query: {
          ...query,
          tab: patternsIndex[index],
        },
      },
      undefined,
      {shallow: true},
    );
  };

  useEffect(() => {
    // We don't expect query.tab to ever be an array of values
    // However this is supported by the spec
    // So we exclude this case in our check.
    if (query.tab && typeof query.tab === 'string' && isReady) {
      console.log(query.tab);
      const index = patterns[query.tab as string]?.index;
      setExampleIndex(index);
    }
  }, [query.tab, isReady]);
  const description =
    'This layout pattern makes it easy for merchants to scan groups of settings and make desired changes';

  useEffect(() => {
    setExampleIndex(0);
  }, []);

  return (
    <>
      <PageMeta title={title} description={description} />

      <Page showTOC={false}>
        <Stack gap="4">
          <Heading as="h1">
            <Row wrap gap="2" className={styles.Heading}>
              {title}{' '}
              <StatusBadge status={{value: StatusName.Beta, message: ''}} />
            </Row>
          </Heading>
          <Lede>{description}</Lede>
          <p className={styles.InfoLine}>
            <Link className={styles.InfoLineLink} href={newDiscussionLink}>
              Discuss on GitHub
            </Link>
          </p>
        </Stack>
        <Tab.Group
          defaultIndex={0}
          selectedIndex={exampleIndex}
          onChange={onTabChange}
        >
          <div className={styles.TabGroup}>
            <Tab.List>
              <div className={styles.ExamplesList} id="examples">
                <Tab>
                  <span>{patterns['single-date'].title}</span>
                </Tab>
                <Tab>
                  <span>{patterns['date-range'].title}</span>
                </Tab>
                <Tab>
                  <span>{patterns['date-list'].title}</span>
                </Tab>
              </div>
            </Tab.List>

            <Tab.Panels>
              <Tab.Panel className={styles.Panel}>
                <Stack gap="8">
                  {description ? (
                    <p>{patterns['single-date'].description}</p>
                  ) : null}
                  <Stack as="section" gap="4" className={styles.MerchantGoal}>
                    <Heading as="h2">How it helps merchants</Heading>
                    <div className={styles.ImageWrapper}>
                      <Image
                        alt=""
                        fill
                        src="/images/patterns/single-list-cover-image.png"
                      />
                    </div>
                    <div>
                      <Stack as="ol" gap="2">
                        <li>
                          The text input gives merchants the option to use the
                          keyboard to enter a date.
                        </li>
                        <li>
                          A single month calendar is previewed after selecting
                          the date input to provide visual affordance of the
                          single date picked. The calendar can then be used to
                          select a new date.
                        </li>
                      </Stack>
                    </div>
                    <TableContainer>
                      <Table>
                        <TableCaption className={styles.WhenToUseCaption}>
                          Use when merchants need to:
                        </TableCaption>
                        <Tbody>
                          <Tr>
                            <Td className={styles.UseCase} shrink>
                              Schedule an event on a <br /> specific day
                            </Td>
                            <Td>
                              Some examples of this are setting a visibility
                              date for a new online store page, or an estimated
                              arrival date for a shipment.
                              <br />
                              Found in: Product / transfers
                            </Td>
                          </Tr>
                          <Tr>
                            <Td className={styles.UseCase} shrink>
                              Input memorable dates to <br />
                              forms
                            </Td>
                            <Td>An example of this is entering a birthdate.</Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Stack>
                  <Stack as="section" gap="4">
                    <Heading as="h2">Using this pattern</Heading>
                    <PatternsExample
                      example={patterns['single-date'].example}
                      patternName={`${title} > ${patterns['single-date'].title}`}
                      relatedComponents={[
                        {label: 'Date picker', url: '/components/date-picker'},
                        {label: 'Text', url: '/components/text-field'},
                      ]}
                    />
                  </Stack>

                  <Stack as="section" gap="4">
                    <Heading as="h3">Useful to know</Heading>
                    <Stack
                      as="ul"
                      className={styles.UsageGuidelinesWrapper}
                      gap="4"
                    >
                      <Row as="li" className={styles.UsageGuidelinesEl} gap="4">
                        <div className={styles.UsageGuidelineTxt}>
                          <p>
                            Labels need to simply depict the task at hand.
                            Whether that be a start date, end date, start time
                            etc.
                          </p>
                        </div>
                        <div className={styles.ImageWrapper}>
                          <Image
                            alt=""
                            fill
                            src="/images/patterns/single-list-usage-1.png"
                          />
                        </div>
                      </Row>
                      <Row as="li" className={styles.UsageGuidelinesEl} gap="4">
                        <div className={styles.UsageGuidelineTxt}>
                          <p>
                            This pattern can be duplicated to allow users to add
                            an end date or time.
                          </p>
                        </div>
                        <div className={styles.ImageWrapper}>
                          <Image
                            alt=""
                            fill
                            src="/images/patterns/single-list-usage-2.png"
                          />
                        </div>
                      </Row>
                    </Stack>
                  </Stack>
                </Stack>
              </Tab.Panel>
              <Tab.Panel className={styles.Panel}>
                <Stack gap="8">
                  {description ? (
                    <p>{patterns['date-range'].description}</p>
                  ) : null}
                  <Stack as="section" gap="4" className={styles.MerchantGoal}>
                    <Heading as="h2">How it helps merchants</Heading>
                    <div className={styles.ImageWrapper}>
                      <Image
                        alt=""
                        fill
                        src="/images/patterns/date-range-cover-image.png"
                      />
                    </div>
                    <div>
                      <Stack as="ol">
                        <li>
                          Providing multiple ways to select a date range gives
                          merchants full flexibility. The list provides quick
                          access to common options, the text input makes it
                          easier to set large custom ranges, and the calendar is
                          an intuitive way to set a more narrow scope.
                        </li>
                        <li>
                          Displaying two months makes it easier for merchants to
                          select date ranges that span across both.
                        </li>
                        <li>
                          Selecting a date range may require multiple steps, so
                          merchants prefer to explicitly confirm their
                          selection, unlike the single date picker which closes
                          on selection.
                        </li>
                      </Stack>
                    </div>
                    <TableContainer>
                      <Table>
                        <TableCaption className={styles.WhenToUseCaption}>
                          Use when merchants need to:
                        </TableCaption>
                        <Tbody>
                          <Tr>
                            <Td className={styles.UseCase} shrink>
                              Analyze trends and data
                            </Td>
                            <Td>
                              When a merchant needs to view their business
                              metrics so that they can learn and make decisions,
                              they use the date range picker to frame data to
                              certain time periods.
                              <br />
                              Found in: Analytics
                            </Td>
                          </Tr>
                          <Tr>
                            <Td className={styles.UseCase} shrink>
                              Schedule an event
                            </Td>
                            <Td>
                              When a merchant needs to schedule an event that
                              spans multiple days, a date range picker is
                              necessary.
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Stack>
                  <Stack as="section" gap="4">
                    <Heading as="h2">Using this pattern</Heading>
                    <PatternsExample
                      example={patterns['date-range'].example}
                      patternName={`${title} > ${patterns['date-range'].title}`}
                      relatedComponents={[
                        {label: 'Date picker', url: '/components/date-picker'},
                        {label: 'Card', url: '/components/card'},
                        {label: 'Action list', url: '/components/action-list'},
                        {label: 'Text', url: '/components/text-field'},
                      ]}
                    />
                  </Stack>

                  <Stack as="section" gap="4">
                    <Heading as="h3">Useful to know</Heading>
                    <Stack
                      as="ul"
                      className={styles.UsageGuidelinesWrapper}
                      gap="4"
                    >
                      <Row as="li" className={styles.UsageGuidelinesEl} gap="4">
                        <div className={styles.UsageGuidelineTxt}>
                          <p>
                            Pin any relevant, merchant-specific dates to the top
                            of the option list.
                          </p>
                        </div>
                        <div className={styles.ImageWrapper}>
                          <Image
                            alt=""
                            fill
                            src="/images/patterns/date-range-usage-1.png"
                          />
                        </div>
                      </Row>
                      <Row as="li" className={styles.UsageGuidelinesEl} gap="4">
                        <div className={styles.UsageGuidelineTxt}>
                          <p>
                            If a date cannot be selected, indicate it with the{' '}
                            <Link href="/tokens/colors">
                              disabled text color token
                            </Link>
                            .
                          </p>
                        </div>
                        <div className={styles.ImageWrapper}>
                          <Image
                            alt=""
                            fill
                            src="/images/patterns/date-range-usage-2.png"
                          />
                        </div>
                      </Row>
                      <Row className={styles.UsageGuidelinesEl} gap="4">
                        <div className={styles.UsageGuidelineTxt}>
                          <p>
                            If a merchant enters a nonexistent date, revert to
                            the previously selected date.
                          </p>
                        </div>
                        <div className={styles.ImageWrapper}>
                          <Image
                            alt=""
                            fill
                            src="/images/patterns/date-range-usage-3.png"
                          />
                        </div>
                      </Row>
                    </Stack>
                  </Stack>
                </Stack>
              </Tab.Panel>
              <Tab.Panel className={styles.Panel}>
                <Stack gap="8">
                  {description ? (
                    <p>{patterns['date-list'].description}</p>
                  ) : null}
                  <Stack as="section" gap="4" className={styles.MerchantGoal}>
                    <Heading as="h2">How it helps merchants</Heading>
                    <div className={styles.ImageWrapper}>
                      <Image
                        alt=""
                        fill
                        src="/images/patterns/date-list-cover-image.png"
                      />
                    </div>
                    <div>
                      <Stack as="ol" gap="4">
                        <li>
                          The date list provides merchants with suggested dates.
                          This makes date picking simpler when useful dates are
                          predictable and custom dates aren’t necessary.
                        </li>
                      </Stack>
                    </div>
                    <TableContainer>
                      <Table>
                        <TableCaption className={styles.WhenToUseCaption}>
                          Use when merchants need to:
                        </TableCaption>
                        <Tbody>
                          <Tr>
                            <Td className={styles.UseCase} shrink>
                              Select from templated dates
                            </Td>
                            <Td>
                              When a templated list of dates is sufficient for
                              the merchant task, use the date list because it is
                              a task that does not require in-depth filtering of
                              historical information. Found in: Inbox app /
                              Overview
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Stack>
                  <Stack as="section" gap="4">
                    <Heading as="h2">Using this pattern</Heading>
                    <PatternsExample
                      example={patterns['date-list'].example}
                      patternName={`${title} > ${patterns['date-list'].title}`}
                      relatedComponents={[
                        {label: 'Action List', url: '/components/action-list'},
                      ]}
                    />
                  </Stack>

                  <Stack as="section" gap="4">
                    <Heading as="h3">Useful to know</Heading>
                    <Stack
                      as="ul"
                      className={styles.UsageGuidelinesWrapper}
                      gap="4"
                    >
                      <Row as="li" className={styles.UsageGuidelinesEl} gap="4">
                        <div className={styles.UsageGuidelineTxt}>
                          <p>
                            In the button preview, set a default date range that
                            a merchant will most likely use.
                          </p>
                        </div>
                        <div className={styles.ImageWrapper}>
                          <Image
                            alt=""
                            fill
                            src="/images/patterns/date-list-usage-1.png"
                          />
                        </div>
                      </Row>
                      <Row as="li" className={styles.UsageGuidelinesEl} gap="4">
                        <div className={styles.UsageGuidelineTxt}>
                          <p>
                            Single dates should be at the top of the list,
                            followed by date ranges from smallest to largest
                            ranges.
                          </p>
                        </div>
                        <div className={styles.ImageWrapper}>
                          <Image
                            alt=""
                            fill
                            src="/images/patterns/date-list-usage-2.png"
                          />
                        </div>
                      </Row>
                      <Row className={styles.UsageGuidelinesEl} gap="4">
                        <div className={styles.UsageGuidelineTxt}>
                          <p>
                            A date list can be modified to serve unique
                            situations, like providing suggested search queries
                            in the customer segment editor.
                          </p>
                        </div>
                        <div className={styles.ImageWrapper}>
                          <Image
                            alt=""
                            fill
                            src="/images/patterns/date-list-usage-3.png"
                          />
                        </div>
                      </Row>
                    </Stack>
                  </Stack>
                </Stack>
              </Tab.Panel>
            </Tab.Panels>
            <Stack as="section" gap="4" className={styles.RelatedResources}>
              <Heading as="h2">Related resources</Heading>
              <Grid gapX="4" gapY="6" itemMinWidth="24rem">
                <GridItem
                  title="Date picker"
                  description="Date pickers let merchants choose dates from a visual calendar that’s consistently applied wherever dates need to be selected across Shopify."
                  url="/components/date-picker"
                  renderPreview={() => (
                    <Preview
                      renderInner={false}
                      src="/images/components/date-picker.png"
                    />
                  )}
                />
                <GridItem
                  title="UTC is for everyone right?"
                  description="Programming with dates, times, and timezones is hard. But here's some help."
                  url="https://zachholman.com/talk/utc-is-enough-for-everyone-right"
                  renderPreview={() => (
                    <Preview
                      renderInner={false}
                      src="/images/patterns/UTC4e1.jpeg"
                    />
                  )}
                />
                <GridItem
                  title="Grammar and mechanics"
                  description="This guide is to help designers, developers, recruiters, UX-ers, product managers, support advisors, or anyone who writes public-facing text for Shopify."
                  url="/content/grammar-and-mechanics#date"
                  renderPreview={() => (
                    <Preview
                      renderInner={false}
                      src="/og-images/content/grammar-and-mechanics.png"
                    />
                  )}
                />
                <GridItem
                  title="Actionable language"
                  description="Merchants use Shopify to get things done. Content should be written and structured to help them understand and take the most important actions."
                  url="/content/actionable-language"
                  renderPreview={() => (
                    <Preview
                      renderInner={false}
                      src="/og-images/content/actionable-language.png"
                    />
                  )}
                />
              </Grid>
            </Stack>
          </div>
        </Tab.Group>
      </Page>
    </>
  );
}
