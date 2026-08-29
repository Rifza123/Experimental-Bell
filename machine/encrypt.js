async function EncryptJs(code) {
  try {
    if (code.length < 4000) {
      try {
        let res = await fetch(
          `${api.xterm.url}/api/tools/js-protector?key=${api.xterm.key}&code=${encodeURIComponent(code)}`
        ).then((response) => response.json());
        if (res?.status && res?.data) return res;
      } catch (e) {}
    }

    try {
      let res = await fetch(
        `${api.xterm.url}/api/tools/js-protector?key=${api.xterm.key}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        }
      ).then((response) => response.json());
      if (res?.status && res?.data) return res;
    } catch (e) {}

    let res = await fetch('https://jsd-online-demo.preemptive.com/api/protect', {
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sourceFile: {
          name: 'online-demo.js',
          source: code,
        },
        protectionConfiguration: {
          settings: {
            booleanLiterals: {
              randomize: false,
            },
            integerLiterals: {
              radix: 'octal',
              randomize: false,
              lower: null,
              upper: null,
            },
            debuggerRemoval: true,
            stringLiterals: true,
            propertyIndirection: true,
            localDeclarations: {
              nameMangling: 'base52',
            },
            controlFlow: {
              randomize: false,
            },
            constantArgument: false,
            domainLock: false,
            functionReorder: false,
            propertySparsing: false,
            variableGrouping: false,
          },
        },
      }),
      method: 'POST',
    }).then((a) => a.json());

    if (res?.protectedCode) {
      return { status: true, data: res.protectedCode };
    }
    return { status: false, msg: res?.message || 'Protection failed' };
  } catch (e) {
    console.error('Error in encrypt.js :' + e.message);
    return { status: false, msg: e.message };
  }
}

export { EncryptJs };
