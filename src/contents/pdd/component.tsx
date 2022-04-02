import { Button, Drawer } from 'antd';
import Table from 'antd/lib/table';
import { useCallback, useRef, useState } from 'react';
import { delay, waitForSelector } from '../../utils';

const forceReactInputOnChange = (input: HTMLInputElement, value: string) => {
  // @ts-expect-error NOTE: clear the interal value to force an actual change
  input._valueTracker?.setValue(value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
};

const skuList = [
  {
    key: '1',
    skuId: '115106840501',
    name: '1-8岁宝宝认数1到100',
    remarkName: '小熊'
  },
  {
    key: '2',
    skuId: '246865038375',
    name: '1-4岁儿童学说话人物早教看图认字卡',
    remarkName: '乐乐鱼'
  },
  {
    key: '3',
    skuId: '153497946159',
    name: '数字卡片',
    remarkName: '小熊'
  },
  {
    key: '4',
    skuId: '95154305953',
    name: '偏旁部首笔画',
    remarkName: '乐乐鱼'
  }
];

const Pdd: React.FC = (props: any) => {
  const $remarkElementsRef = useRef<JQuery<HTMLElement> | null>(null);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<number | null>(null);

  const doTask = async (text: string, skuId?: string): Promise<boolean> => {
    if (skuId) {
      const $skuInpt = $("input[placeholder='请输入完整商品ID']");
      $skuInpt.val(skuId);
      forceReactInputOnChange($skuInpt[0] as HTMLInputElement, skuId);
      await delay(1000);
      $(`button:contains('查询')`).trigger('click');
      await delay(2000);
    }
    const $remarkElements = $(".package-center-table a:contains('添加备注')");
    $remarkElementsRef.current = $remarkElements || [];
    const nodes = $remarkElementsRef.current;
    if (nodes.length > 0) {
      const len = nodes.length;
      let index = 0;
      while (index < len) {
        // if (step === null) {
        //     return false;
        // }
        const current = nodes[index];
        index++;
        if (!current) continue;
        current.click();
        console.log('next index', index, current);
        await delay(500);
        const ele = await waitForSelector('.note-textarea', {
          timeout: 2000
        });
        if (ele === null) {
          continue;
        }
        const $textArea = $('.note-textarea');
        const val = $textArea.val();
        if ($textArea) {
          if (val && String(val).trim() !== '') {
            console.log('跳过已经备注的...');
            $(`button:contains('取消')`).trigger('click');
          } else {
            // if (step === null) {
            //     return false;
            // }
            console.log('$textArea', val);
            $textArea.val(text).trigger('change');
            forceReactInputOnChange($textArea[0] as HTMLInputElement, text);
            await delay(1000);
            $(`button:contains('保存')`).trigger('click');
          }
        }
        await delay(1000);
      }
      await delay(1000);
      $(`button:contains('查询')`).trigger('click');
      await delay(2000);
      if (skuId) {
        return doTask(text, skuId);
      }
      return true;
    }
    return true;
  };

  const columns = [
    {
      title: 'SKU',
      dataIndex: 'skuId',
      key: 'skuId'
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '备注',
      dataIndex: 'remarkName',
      key: 'remarkName',
      render: (text: string, record: any) => (
        <a
          onClick={() => {
            setVisible(false);
            doTask(text, record.skuId);
          }}
        >
          {text}
        </a>
      )
    }
  ];

  const start = useCallback(async () => {
    setVisible(false);
    for (let i = 0; i < skuList.length; i++) {
      const sku = skuList[i];
      setStep(i);
      const res = await doTask(sku.remarkName, sku.skuId);
      if (res === false) {
        setStep(null);
        return;
      }
    }
    console.log('没有需要备注的');
    alert('没有需要备注的了');
    setStep(null);
  }, []);

  return (
    <div className="pddroot">
      {step === null ? (
        <Button
          type="primary"
          onClick={() => {
            setVisible(true);
          }}
        >
          点击开始备注
        </Button>
      ) : (
        <Button
          type="primary"
          onClick={() => {
            setStep(null);
          }}
          danger
        >
          正在备注中...（{skuList[step]?.name}）
        </Button>
      )}

      <Button
        className="pdd-button"
        type="primary"
        onClick={() => {
          doTask('乐乐鱼');
        }}
      >
        乐乐鱼
      </Button>
      <Button
        className="pdd-button"
        type="primary"
        onClick={() => {
          doTask('小熊');
        }}
      >
        小熊
      </Button>
      <Drawer
        title={
          <>
            <Button
              onClick={() => {
                start();
              }}
              type="primary"
              className="btn-batch"
            >
              批量备注
            </Button>
          </>
        }
        placement="top"
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      >
        <Table dataSource={skuList} columns={columns} pagination={false} />
      </Drawer>
    </div>
  );
};

export default Pdd;
