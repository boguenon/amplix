const { containerBootstrap } = require('@nlpjs/core-loader');
const { NlpManager } = require('node-nlp');
const bodyParser = require('body-parser');
const fs = require('fs');

(async () => {
	const container = containerBootstrap();
	await container.start();
	
	const logger = container.get('logger');
	const server = container.get('api-server').app;
	
	if (!server) 
	{
		throw new Error('No api-server found');
    }
	
	server.use(bodyParser.text({defaultCharset: 'utf-8'}));
	
	logger['info']("training web api");
	
	server.post('/directline/train', async (req, res) => {
		logger['info']("POST /directline/train");
		var data = req.body.nlpset,
			i, j, k,
			_lng = {},
			fset = "nlp_set_" + ((new Date()).getTime() / 1000),
			d, trule;
		
		const manager = new NlpManager({languages: ['en', 'ja', 'ko']});
		let conf = JSON.parse(fs.readFileSync('conf.json', 'utf8'));
		
		conf.settings.nlp.languages = [];
		conf.settings.nlp.corpora = [];
		
		if (data)
		{
			for (i=0; i < data.length; i++)
			{
				var dt = data[i],
					uid = dt.uid;
					locale = dt.locale,
					lang = locale.substring(0, 2),
					cfile = "./corpus_" + uid;
					
				if (!_lng[lang])
				{
					_lng[lang] = 1;
					conf.settings.nlp.languages.push(lang);
				}
				
				if (dt.corpora)
				{
					for (j=0; j < dt.corpora.length; j++)
					{
						fs.writeFileSync(cfile + "_" + j + ".json", JSON.stringify(dt.corpora[j], null, 2), 'utf8');
						conf.settings.nlp.corpora.push(cfile + "_" + j + ".json");
						manager.nlp.addCorpus(cfile + "_" + j + ".json");
					}
				}
				
				if (dt.trim_entities)
				{
					for (j=0; j < dt.trim_entities.length; j++)
					{
						d = dt.trim_entities[j];
						if (d.type == "enum")
						{
							if (d.enum_options)
							{
								manager.addNamedEntityText(d.intent, d.option, lang, d.enum_options.texts);
							}
						}
						else if (d.type == "regex")
						{
							if (d.regex)
							{
								manager.addRegexEntity(d.intent, lang, d.regex);
							}
						}
						else if (d.type == "trim")
						{
							if (d.trim_rules && d.trim_rules.length)
							{
								for (k=0; k < d.trim_rules.length; k++)
								{
									trule = d.trim_rules[k];
									
									switch (trule.type + "AAA")
									{
									case "between":
										if (trule.left_words && trule.left_words.length && trule.right_words && trule.right_words.length)
											manager.addBetweenCondition(lang, d.intent, trule.left_words, trule.right_words, trule.options);
										break;
									case "after":
										if (trule.words && trule.words.length)
											manager.addAfterCondition(lang, d.intent, trule.words, trule.options);
										break;
									case "afterlast":
										if (trule.words && trule.words.length)
											manager.addAfterLastCondition(lang, d.intent, trule.words, trule.options);
										break;
									case "afterfirst":
										if (trule.words && trule.words.length)
											manager.addAfterFirstCondition(lang, d.intent, trule.words, trule.options);
										break;
									case "before":
										if (trule.words && trule.words.length)
											manager.addBeforeCondition(lang, d.intent, trule.words, trule.options);
										break;
									case "beforefirst":
										if (trule.words && trule.words.length)
											manager.addBeforeFirstCondition(lang, d.intent, trule.words, trule.options);
										break;
									case "beforelast":
										if (trule.words && trule.words.length)
											manager.addBeforeLastCondition(lang, d.intent, trule.words, trule.options);
										break;
									}
								}
							}
						}
					}
				}
				
				if (dt.slotfills)
				{
					for (j=0; j < dt.slotfills.length; j++)
					{
						d = dt.slotfills[j];
						if (d.fill_message.length)
						{
							var smsg = {};
							smsg[lang] = d.fill_message[0];
							manager.nlp.slotManager.addSlot(d.intent, d.trim_entity, d.mandatory, smsg);
						}
					}
				}
			}
		}
		
		conf.settings.nlp.modelFileName = fset + ".nlp";
		fs.writeFileSync('conf.json', JSON.stringify(conf, null, 2), "utf8");
		
		logger["info"]("training model");
		
		try
		{
			await manager.train();
			manager.save(fset + ".nlp");
		}
		catch (error)
		{
			logger["error"]("error on training model");
			return next(error);
		}
		
		const nlp = container.get('nlp');
		
		if (nlp)
		{
			nlp.load(fset + ".nlp");
			logger.info("successfully loaded train model");
		}
		else
		{
			logger.error("error on applying train model");
		}
		
		res.body = {success: true};
		
		res.send(res.body);
    });
})();
